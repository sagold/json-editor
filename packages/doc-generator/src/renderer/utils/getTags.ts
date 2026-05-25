import { DocTag } from '../../parser/utils/getDocs';

export const getTags = (tags?: DocTag[], type?: string) => tags?.filter((tag) => tag.tag === type);
