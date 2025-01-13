// import { v4 as uuid } from 'uuid';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId({ length: 12 });
export const uuid = () => uid.rnd();
