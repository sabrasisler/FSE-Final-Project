export const isValidRegex = (field: string, regex: RegExp): boolean => {
  if (!field) return false;
  const normalizedField: string = field.toLowerCase().trim();
  const valid = new RegExp(regex);
  if (!normalizedField || !valid.test(normalizedField)) {
    return false;
  }
  return true;
};
