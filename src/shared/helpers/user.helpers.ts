export const isEmpty = (object: Record<string, any>) => {
  return (
    Object.values(object).length === 0 ||
    Object.values(object).some((value) => !value || value.length === 0)
  );
};
