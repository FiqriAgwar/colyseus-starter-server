export interface Metadata {
  [prop : string] : unknown;
}

export function setMeta<T = any>(metadata: Metadata, key: string, value: T): void{
  metadata[key] = value;
}

export function getMeta<T = any>(metadata: Metadata, key: string, init?: T): T{
  const result: T = metadata[key] as T;

  if(result === undefined && init !== undefined){
    setMeta<T>(metadata, key, init);
  }

  return metadata[key] as T;
}

export function deleteMeta<T = any>(metadata: Metadata, key: string){
  delete metadata[key];
}

export function addMeta(metadata: Metadata, key: string, value = 1): void{
  const check = metadata[key];

  if(check !== undefined && typeof check !== 'number'){
    return;
  }

  metadata[key] = (check || 0) + value;
}

export function runMeta<T = any>(metadata: Metadata, key: string, type: keyof T, ...argv: any[]){
  const check = metadata[key] as T;
  const test = check && check[type];

  if(typeof test !== 'function'){
    return undefined;
  }

  return test(...argv);
}

export function mergeMeta(target: Metadata, value: Metadata){
  Object.keys(value).forEach((key) => {
    setMeta(target, key, value[key]);
  });
}