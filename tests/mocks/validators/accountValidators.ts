import {
  AccountDetail,
  AccountTransfer,
  AccountDefiActivity,
  AccountBalanceChange,
  AccountTransaction,
  AccountPortfolio,
  AccountTokenAccount,
  AccountMetadata,
  AccountLeaderboard,
  AccountStake,
} from "../../../src/types/account";

// Account validators
export function validateAccountDetail(data: any): data is AccountDetail {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.account === "string" &&
    typeof data.lamports === "number" &&
    typeof data.type === "string" &&
    typeof data.executable === "boolean" &&
    typeof data.owner_program === "string" &&
    typeof data.rent_epoch === "number" &&
    typeof data.is_oncurve === "number"
  );
}

export function validateAccountTransfer(data: any): data is AccountTransfer {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.block_id === "number" &&
    typeof data.trans_id === "string" &&
    typeof data.block_time === "number" &&
    typeof data.time === "string" &&
    typeof data.activity_type === "string" &&
    typeof data.from_address === "string" &&
    typeof data.from_token_account === "string" &&
    typeof data.to_address === "string" &&
    typeof data.to_token_account === "string" &&
    typeof data.token_address === "string" &&
    typeof data.token_decimals === "number" &&
    typeof data.amount === "number" &&
    typeof data.flow === "string"
  );
}

export function validateAccountDefiActivity(
  data: any
): data is AccountDefiActivity {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.block_id === "number" &&
    typeof data.trans_id === "string" &&
    typeof data.block_time === "number" &&
    typeof data.time === "string" &&
    typeof data.activity_type === "string" &&
    typeof data.from_address === "string" &&
    Array.isArray(data.sources) &&
    Array.isArray(data.platform) &&
    typeof data.value === "number" &&
    typeof data.routers === "object" &&
    data.routers !== null &&
    typeof data.routers.token1 === "string" &&
    typeof data.routers.token1_decimals === "number" &&
    (data.routers.amount1 === null || typeof data.routers.amount1 === "number") &&
    typeof data.routers.token2_decimals === "number" &&
    (data.routers.token2 === undefined || typeof data.routers.token2 === "string") &&
    (data.routers.amount2 === undefined || typeof data.routers.amount2 === "number") &&
    (data.routers.child_routers === undefined || 
      (Array.isArray(data.routers.child_routers) &&
        data.routers.child_routers.every(
          (router: any) =>
            typeof router === "object" &&
            router !== null &&
            typeof router.token1 === "string" &&
            typeof router.token1_decimals === "number" &&
            typeof router.amount1 === "string" &&
            typeof router.token2 === "string" &&
            typeof router.token2_decimals === "number" &&
            typeof router.amount2 === "string" &&
            typeof router.program_address === "string" &&
            typeof router.pool_address === "string"
        )))
  );
}

export function validateAccountBalanceChange(
  data: any
): data is AccountBalanceChange {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.block_id === "number" &&
    typeof data.block_time === "number" &&
    typeof data.time === "string" &&
    typeof data.trans_id === "string" &&
    typeof data.address === "string" &&
    typeof data.token_address === "string" &&
    typeof data.token_decimals === "number" &&
    typeof data.token_account === "string" &&
    typeof data.amount === "number" &&
    typeof data.pre_balance === "number" &&
    typeof data.post_balance === "number" &&
    (data.change_type === "inc" || data.change_type === "dec") &&
    typeof data.fee === "number"
  );
}

export function validateAccountTransaction(
  data: any
): data is AccountTransaction {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.slot === "number" &&
    typeof data.fee === "number" &&
    (data.status === "Success" || data.status === "Fail") &&
    typeof data.signer === "string" &&
    typeof data.block_time === "number" &&
    typeof data.tx_hash === "string" &&
    Array.isArray(data.parsed_instructions) &&
    data.parsed_instructions.every(
      (instruction: any) =>
        typeof instruction === "object" &&
        instruction !== null &&
        typeof instruction.type === "string" &&
        typeof instruction.program === "string" &&
        typeof instruction.program_id === "string"
    ) &&
    typeof data.program_ids === "string" &&
    typeof data.time === "string"
  );
}

export function validateAccountPortfolio(data: any): data is AccountPortfolio {
  const validateToken = (token: any): boolean => {
    return (
      typeof token === "object" &&
      token !== null &&
      typeof token.amount === "number" &&
      typeof token.balance === "number" &&
      typeof token.token_price === "number" &&
      typeof token.token_decimals === "number" &&
      typeof token.token_name === "string" &&
      typeof token.token_symbol === "string" &&
      typeof token.token_icon === "string" &&
      typeof token.value === "number" &&
      (token.token_address === undefined ||
        typeof token.token_address === "string")
    );
  };

  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.total_value === "number" &&
    typeof data.native_balance === "object" &&
    data.native_balance !== null &&
    validateToken(data.native_balance) &&
    Array.isArray(data.tokens) &&
    data.tokens.every(validateToken)
  );
}

export function validateAccountTokenAccount(
  data: any
): data is AccountTokenAccount {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.token_account === "string" &&
    typeof data.token_address === "string" &&
    typeof data.amount === "number" &&
    typeof data.token_decimals === "number" &&
    typeof data.owner === "string"
  );
}

export function validateAccountMetadata(data: any): data is AccountMetadata {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.account_address === "string" &&
    typeof data.account_label === "string" &&
    typeof data.account_icon === "string" &&
    Array.isArray(data.account_tags) &&
    data.account_tags.every((tag: any) => typeof tag === "string") &&
    typeof data.account_type === "string"
  );
}

export function validateAccountLeaderboard(
  data: any
): data is AccountLeaderboard {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.total === "number" &&
    Array.isArray(data.data) &&
    data.data.every(
      (item: any) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.account === "string" &&
        typeof item.sol_values === "number" &&
        typeof item.token_values === "number" &&
        typeof item.stake_values === "number" &&
        typeof item.total_values === "number"
    )
  );
}

export function validateAccountStake(data: any): data is AccountStake {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.stake_account === "string" &&
    typeof data.validator === "string" &&
    typeof data.amount === "number" &&
    typeof data.status === "string" &&
    typeof data.activation_epoch === "number" &&
    (data.deactivation_epoch === null ||
      typeof data.deactivation_epoch === "number")
  );
}
