export default interface Encrypter {
  encrypt(value: string): Promise<string>;
}
