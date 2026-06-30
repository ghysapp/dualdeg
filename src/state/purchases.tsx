/**
 * "Remove ads" in-app purchase state.
 *
 * The app stores (Apple / Google) are the source of truth — there is no
 * backend. We cache the entitlement locally (AsyncStorage) for instant UX,
 * then reconcile against the store at launch and via "Restore purchase". On a
 * reinstall the entitlement is recovered from the store (tied to the user's
 * store account), not from this device.
 *
 * The native IAP module is lazy-`require`d and gated by `iapAvailable` so the
 * app still runs in Expo Go (where IAP is unavailable).
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { REMOVE_ADS_PRODUCT_ID } from '@/config';
import { loadJson, saveJson } from '@/services/cache';

const FLAG_KEY = 'dualdeg:removeAds';

/** False in Expo Go (no native IAP module); true in dev/prod builds. */
export const iapAvailable =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

interface IapPurchase {
  productId?: string | null;
  ids?: string[] | null;
}

function ownsRemoveAds(purchases: IapPurchase[] | null | undefined): boolean {
  if (!Array.isArray(purchases)) return false;
  return purchases.some(
    (p) => p?.productId === REMOVE_ADS_PRODUCT_ID || p?.ids?.includes?.(REMOVE_ADS_PRODUCT_ID),
  );
}

interface PurchasesContextValue {
  /** True when the user owns the ad-free entitlement. */
  removeAds: boolean;
  /** Localized store price (e.g. "$1.99"), or null if not loaded. */
  price: string | null;
  /** IAP usable on this build (false in Expo Go). */
  available: boolean;
  /** True once the initial entitlement check (cache + store) has settled. */
  ready: boolean;
  /** A purchase or restore is in flight. */
  purchasing: boolean;
  buy: () => Promise<void>;
  restore: () => Promise<boolean>;
}

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [removeAds, setRemoveAds] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [ready, setReady] = useState(false);
  const iap = useRef<any>(null);

  const setOwned = useCallback((owned: boolean) => {
    setRemoveAds(owned);
    saveJson(FLAG_KEY, owned);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let updateSub: any;
    let errorSub: any;

    (async () => {
      try {
        // 1. Instant entitlement from the local cache.
        const cached = await loadJson<boolean>(FLAG_KEY, false);
        if (!cancelled) setRemoveAds(cached);
        if (!iapAvailable) return;

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const IAP = require('react-native-iap');
        iap.current = IAP;
        await IAP.initConnection();

        // React to purchases (including ones completed off-screen).
        updateSub = IAP.purchaseUpdatedListener(async (purchase: IapPurchase) => {
          if (ownsRemoveAds([purchase])) {
            setOwned(true);
            try {
              await IAP.finishTransaction({ purchase, isConsumable: false });
            } catch {
              // already finished / will replay
            }
          }
          setPurchasing(false);
        });
        errorSub = IAP.purchaseErrorListener(() => setPurchasing(false));

        // Localized price for the button.
        try {
          const products = await IAP.fetchProducts({ skus: [REMOVE_ADS_PRODUCT_ID], type: 'in-app' });
          const product = Array.isArray(products) ? products[0] : null;
          if (product && !cancelled) {
            setPrice(product.displayPrice ?? product.localizedPrice ?? null);
          }
        } catch {
          // price stays null — button falls back to a generic label
        }

        // Reconcile entitlement against the store (source of truth).
        try {
          const purchases = await IAP.getAvailablePurchases();
          if (!cancelled) setOwned(ownsRemoveAds(purchases));
        } catch {
          // offline / query failed — keep the cached value
        }
      } catch {
        // IAP unavailable on this build
      } finally {
        // Entitlement is now settled (cache, and store if available).
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      updateSub?.remove?.();
      errorSub?.remove?.();
      try {
        iap.current?.endConnection?.();
      } catch {
        // ignore
      }
    };
  }, [setOwned]);

  const buy = useCallback(async () => {
    if (!iapAvailable || !iap.current) return;
    setPurchasing(true);
    try {
      await iap.current.requestPurchase({
        request: {
          apple: { sku: REMOVE_ADS_PRODUCT_ID },
          google: { skus: [REMOVE_ADS_PRODUCT_ID] },
        },
        type: 'in-app',
      });
      // Success is handled by purchaseUpdatedListener.
    } catch {
      setPurchasing(false);
    }
  }, []);

  const restore = useCallback(async (): Promise<boolean> => {
    if (!iapAvailable || !iap.current) return false;
    setPurchasing(true);
    try {
      const purchases = await iap.current.getAvailablePurchases();
      const owned = ownsRemoveAds(purchases);
      setOwned(owned);
      return owned;
    } catch {
      return false;
    } finally {
      setPurchasing(false);
    }
  }, [setOwned]);

  const value: PurchasesContextValue = {
    removeAds,
    price,
    available: iapAvailable,
    ready,
    purchasing,
    buy,
    restore,
  };

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchases(): PurchasesContextValue {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error('usePurchases must be used within a PurchasesProvider');
  return ctx;
}
