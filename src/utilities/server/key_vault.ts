import { DefaultAzureCredential } from "@azure/identity"
import { SecretClient } from "@azure/keyvault-secrets"

export async function retrievedSecret(secretname: string) {
    const keyVaultName = process.env.KEY_VAULT_NAME
    const KVUri = "https://" + keyVaultName + ".vault.azure.net"
    const credential = new DefaultAzureCredential()
    const client = new SecretClient(KVUri, credential)
    return await client.getSecret(secretname)
}
