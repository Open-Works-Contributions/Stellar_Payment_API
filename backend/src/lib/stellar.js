import 'dotenv/config';
import * as StellarSdk from "stellar-sdk";

const NETWORK = (process.env.STELLAR_NETWORK || "testnet").toLowerCase();
const HORIZON_URL =
  process.env.STELLAR_HORIZON_URL ||
  (NETWORK === "public"
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org");

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export function resolveAsset(assetCode, assetIssuer) {
  if (!assetCode) {
    throw new Error("Asset code is required");
  }

  if (assetCode.toUpperCase() === "XLM") {
    return StellarSdk.Asset.native();
  }

  if (!assetIssuer) {
    throw new Error("Asset issuer is required for non-native assets");
  }

  return new StellarSdk.Asset(assetCode.toUpperCase(), assetIssuer);
}

function amountsMatch(expected, received) {
  const expectedNum = Number(expected);
  const receivedNum = Number(received);

  if (Number.isNaN(expectedNum) || Number.isNaN(receivedNum)) {
    return false;
  }

  return Math.abs(expectedNum - receivedNum) <= 0.0000001;
}

function paymentMatchesAsset(payment, asset) {
  if (asset.isNative()) {
    return payment.asset_type === "native";
  }

  return (
    payment.asset_code === asset.code &&
    payment.asset_issuer === asset.issuer
  );
}

export async function findMatchingPayment({
  recipient,
  amount,
  assetCode,
  assetIssuer
}) {
  const asset = resolveAsset(assetCode, assetIssuer);

  const page = await server
    .payments()
    .forAccount(recipient)
    .order("desc")
    .limit(200)
    .call();

  for (const payment of page.records) {
    if (payment.type !== "payment") {
      continue;
    }

    if (!paymentMatchesAsset(payment, asset)) {
      continue;
    }

    if (!amountsMatch(amount, payment.amount)) {
      continue;
    }

    return {
      id: payment.id,
      transaction_hash: payment.transaction_hash
    };
  }

  return null;
}

export function getStellarConfig() {
  return {
    network: NETWORK,
    horizonUrl: HORIZON_URL
  };
}
