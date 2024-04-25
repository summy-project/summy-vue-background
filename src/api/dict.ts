import { http } from "@/utils/fetch";

/**
 * 根据字典类型获取一类字典值
 * @param id 字典id
 * @returns
 */
const getDictValue = (type: string) => {
  return http("GET", `/dict/findDictValue?type=${type}`);
};

export default {
  getDictValue
};
