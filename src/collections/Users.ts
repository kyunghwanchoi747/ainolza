import type { CollectionConfig } from 'payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ainolza.kr'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    forgotPassword: {
      generateEmailSubject: () => 'AI놀자 비밀번호 재설정 안내',
      generateEmailHTML: (args) => {
        const token = (args as { token?: string })?.token || ''
        const user = (args as { user?: { email?: string; name?: string } })?.user
        const name = user?.name || user?.email?.split('@')[0] || '회원'
        const resetUrl = `${SITE_URL}/reset-password?token=${token}`
        return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;padding:48px 40px;">
        <tr><td>
          <div style="text-align:center;margin-bottom:32px;">
            <h1 style="color:#D4756E;font-size:28px;font-weight:bold;margin:0;">AI놀자</h1>
          </div>
          <h2 style="color:#333;font-size:22px;font-weight:bold;margin:0 0 16px;">비밀번호 재설정 안내</h2>
          <p style="color:#666;font-size:15px;line-height:1.7;margin:0 0 24px;">
            안녕하세요, <strong>${name}</strong>님.<br>
            AI놀자 비밀번호 재설정을 요청하셨습니다.<br>
            아래 버튼을 클릭하여 새 비밀번호를 설정해주세요.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:#D4756E;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:16px;font-weight:bold;">비밀번호 재설정</a>
          </div>
          <p style="color:#999;font-size:13px;line-height:1.6;margin:24px 0 0;">
            버튼이 작동하지 않으면 아래 주소를 복사해 브라우저에 붙여넣어주세요.<br>
            <a href="${resetUrl}" style="color:#D4756E;word-break:break-all;">${resetUrl}</a>
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">
          <p style="color:#999;font-size:12px;line-height:1.6;margin:0;">
            본 메일은 비밀번호 재설정을 요청하신 분께 발송됩니다.<br>
            요청하지 않으셨다면 이 메일을 무시해주세요. 링크는 1시간 동안 유효합니다.
          </p>
          <p style="color:#ccc;font-size:11px;text-align:center;margin:24px 0 0;">
            © AI놀자 · info@ainolza.kr
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '이름',
    },
    {
      name: 'phone',
      type: 'text',
      label: '연락처',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
    },
    {
      name: 'mustResetPassword',
      type: 'checkbox',
      label: '첫 로그인 시 비밀번호 재설정 필수',
      defaultValue: false,
    },
    {
      name: 'importedFrom',
      type: 'text',
      label: '이전 출처',
    },
    {
      name: 'googleId',
      type: 'text',
      label: '구글 ID',
      index: true,
    },
    {
      name: 'kakaoId',
      type: 'text',
      label: '카카오 ID',
      index: true,
    },
    {
      name: 'naverId',
      type: 'text',
      label: '네이버 ID',
      index: true,
    },
  ],
}
