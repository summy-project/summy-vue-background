import NotificationPlugin from "tdesign-vue-next/es/notification/plugin";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ResponseType = "json" | "text" | "blob" | "arrayBuffer" | "formData";

/**
 * 获取当前用户的认证令牌。
 * @returns 返回当前用户的认证令牌，如果没有认证令牌则返回 null。
 */
const getToken = (): string | null => {
  return (
    window.sessionStorage.getItem("userAuthToken") ||
    window.localStorage.getItem("userAuthToken")
  );
};

/**
 * 执行HTTP请求的通用函数。
 * @param method 请求方法，支持GET、POST、PUT、DELETE和PATCH。
 * @param url 请求的URL。
 * @param data 可选，请求的数据。
 * @param responseType 可选，响应的数据类型，默认为"json"。支持的类型有"json"、"text"、"blob"、"arrayBuffer"和"formData"。
 * @param headers 可选，请求头信息。
 * @returns 返回一个Promise，解析为请求结果。
 */
export async function http(
  method: HttpMethod,
  url: string,
  data?: any,
  responseType: ResponseType = "json",
  headers?: HeadersInit
): Promise<any> {
  const BASE_URL = "/api";
  const AUTH_TOKEN = getToken();

  /**
   * 配置网络请求的初始化参数
   * @param method 请求方法（如GET、POST等）
   * @param headers 请求头信息，可以是预设的或用户自定义的
   * @param data 请求体数据，如果有的话
   * @param AUTH_TOKEN 认证令牌，如果存在则会添加到请求头中
   * @returns 返回一个配置好的 RequestInit 对象，可用于fetch等网络请求中
   */
  const config: RequestInit = {
    method,
    headers: new Headers({
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
      ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {})
    }),
    ...(data ? { body: data } : {})
  };

  // 如果请求方法需要数据并且数据是对象类型，则序列化数据。
  if (["POST", "PUT", "PATCH"].includes(method) && typeof data === "object") {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(BASE_URL + url, config);

    if (!response.ok) {
      console.error(`HTTP ${response.status} 错误。`);
    }

    // 根据响应类型处理响应数据
    let responseData;
    switch (responseType) {
      case "json":
        responseData = await response.json();
        if (!response.ok || responseData.status !== "success") {
          NotificationPlugin.error({
            title: `错误`,
            content: `HTTP 状态码 ${response.status}，消息：${responseData.message}`
          });
        }
        return responseData;
      case "text":
        responseData = response.text();
        return responseData;
      case "blob":
        responseData = response.blob();
        return responseData;
      case "arrayBuffer":
        responseData = response.arrayBuffer();
        return responseData;
      case "formData":
        responseData = response.formData();
        return responseData;
      default:
        responseData = response;
        return responseData;
    }
  } catch (error) {
    console.error("请求时发生错误", error);
    throw error;
  }
}
