export default class MathTools {
  public static encryptForKey(value: string): string {
    return value;
  }

  public static RootUUID() {
    return '00000000-0000-0000-0000-000000000000';
  }

  private static S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  public static UUID() {
    return `${MathTools.S4()}${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}-${MathTools.S4()}${MathTools.S4()}${MathTools.S4()}`;
  }
}
