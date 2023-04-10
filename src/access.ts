/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { loginUser?: API.UserVO } | undefined) {
  const { loginUser } = initialState ?? {};
  return {
    canAdmin: loginUser && loginUser.role === 'admin',
  };
}
