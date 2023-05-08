import classNames from 'classnames'
import CryptoJS from 'crypto-js'

interface AvatarProps {
  email: string
  className?: string
}

function md5(str: string) {
  return CryptoJS.MD5(str).toString()
}

function generateAvatarUrl(emailAddress: string) {
  const emailHash = md5(emailAddress)
  return `https://www.gravatar.com/avatar/${emailHash}`
}

const Avatar = ({ className, email }: AvatarProps) => {
  return (
    <div className={classNames('avatar', className)}>
      <img src={generateAvatarUrl(email)} />
    </div>
  )
}

export default Avatar