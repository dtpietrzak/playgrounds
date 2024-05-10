import isObject from "isobject";
import { object1 } from "./object1";
import { object2 } from "./object2";

let descrepanciesFound = 0;

function _compareArrays(
  array1: unknown[],
  array2: unknown[],
  path: string = ""
) {
  if (array1.length !== array2.length) {
    descrepanciesFound++;
    console.log(`Difference in array lengths at path '${path}':`);
    console.log(`  Object 1:`, array1.length);
    console.log(`  Object 2:`, array2.length);
  }
  if (JSON.stringify(array1) !== JSON.stringify(array2)) {
    descrepanciesFound++;
    console.log(`Difference in array at path '${path}':`);
    for (let i = 0; i < array1.length; i++) {
      const newPath = `${path}[${i}]`;
      const itemInArray1 = array1[i];
      const itemInArray2 = array2[i];
      if (JSON.stringify(itemInArray1) !== JSON.stringify(itemInArray2)) {
        descrepanciesFound++;
        console.log(`Difference in array item at path '${newPath}':`);
        if (isObject(itemInArray1) && isObject(itemInArray2)) {
          _compareObjects(itemInArray1, itemInArray2, `${newPath}`);
        } else if (Array.isArray(itemInArray1) && Array.isArray(itemInArray2)) {
          _compareArrays(itemInArray1, itemInArray2, newPath);
        } else if (itemInArray1 !== itemInArray2) {
          console.log(`  Object 1:`, itemInArray1);
          console.log(`  Object 2:`, itemInArray2);
        }
      }
    }
  }
}

function _compareObjects(obj1: any, obj2: any, path: string = ""): void {
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  keys.forEach((key) => {
    const newPath = path ? `${path}.${key}` : key;

    if (isObject(obj1[key]) && isObject(obj2[key])) {
      _compareObjects(obj1[key], obj2[key], newPath);
    } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      _compareArrays(obj1[key], obj2[key], newPath);
    } else if (obj1[key] !== obj2[key]) {
      descrepanciesFound++;
      console.log(`Difference in property '${newPath}':`);
      console.log(`  Object 1:`, obj1[key]);
      console.log(`  Object 2:`, obj2[key]);
    }
  });
}

export function compareObjects(): void {
  _compareObjects(object1, object2);
  console.log("Descrepancies Found: ", descrepanciesFound);
}

export default compareObjects;
