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
    <div className='avatar'>
      <div className={classNames(className)}>
        <img src={generateAvatarUrl(email)} />
      </div>
    </div>
  )
}

export default Avatar
