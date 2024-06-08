import KSUID from "ksuid";

export async function createAsyncId() {
  return KSUID.random().then((ksuid) => ksuid.string);
}
