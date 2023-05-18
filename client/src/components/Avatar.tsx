import classnames from 'classnames'
import CryptoJS from 'crypto-js'

interface AvatarProps {
  email?: string
  url?: string
  className?: string
}

function md5(str: string) {
  return CryptoJS.MD5(str).toString()
}

function generateAvatarUrl(emailAddress: string) {
  const emailHash = md5(emailAddress)
  return `https://dn-qiniu-avatar.qbox.me/avatar/${emailHash}`
}

const Avatar = ({ className, email, url }: AvatarProps) => {
  return (
    <div className={classnames('avatar', className)}>
      {email && <img src={generateAvatarUrl(email)} />}
      {url && <img src={url} />}
    </div>
  )
}

export default Avatar
