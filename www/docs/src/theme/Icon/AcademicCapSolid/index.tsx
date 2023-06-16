import React from "react"
import { IconProps } from ".."

const IconAcademicCapSolid: React.FC<IconProps> = ({
  iconColorClassName,
  ...props
}) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.67899 1.93018C9.77863 1.88025 9.88855 1.85425 10 1.85425C10.1115 1.85425 10.2214 1.88025 10.321 1.93018C13.1299 3.33766 15.7595 5.07749 18.1534 7.11227C18.2506 7.19485 18.324 7.30188 18.3661 7.42232C18.4081 7.54275 18.4172 7.67222 18.3925 7.79736C18.3677 7.9225 18.31 8.03876 18.2254 8.13415C18.1407 8.22954 18.0321 8.30059 17.9107 8.33996C15.249 9.20318 12.7213 10.4349 10.4013 11.9991C10.2828 12.0792 10.143 12.122 10 12.122C9.85698 12.122 9.71723 12.0792 9.59873 11.9991C8.95249 11.5637 8.28958 11.1535 7.6115 10.7695V9.64504C7.6115 9.41192 7.72233 9.20269 7.90003 9.07944C8.91637 8.37493 9.97048 7.72651 11.0576 7.13711C11.222 7.04516 11.3435 6.89222 11.3959 6.71137C11.4484 6.53052 11.4275 6.3363 11.3379 6.1707C11.2482 6.00511 11.097 5.88145 10.9169 5.82648C10.7368 5.77151 10.5423 5.78963 10.3755 5.87694C9.24192 6.49154 8.14284 7.1677 7.08316 7.90239C6.80297 8.09811 6.57432 8.35876 6.41677 8.66206C6.25921 8.96536 6.17742 9.3023 6.1784 9.64409V10.0071C4.85835 9.35105 3.49158 8.79348 2.08928 8.33901C1.96795 8.29963 1.85934 8.22858 1.77465 8.13319C1.68996 8.03781 1.63227 7.92154 1.60753 7.7964C1.5828 7.67127 1.59192 7.5418 1.63394 7.42136C1.67597 7.30093 1.74939 7.19389 1.84661 7.11132C4.24046 5.07653 6.8701 3.3367 9.67899 1.92922V1.93018ZM6.1784 11.6179C5.41374 11.2138 4.6311 10.8446 3.83289 10.5116C3.67079 11.4982 3.5465 12.4906 3.46028 13.4867C3.4476 13.6312 3.47907 13.7762 3.55055 13.9024C3.62203 14.0287 3.73014 14.1302 3.8606 14.1937C4.36505 14.4383 4.85994 14.7001 5.34529 14.9771C5.14465 15.2867 4.91058 15.579 4.63925 15.8504C4.56885 15.916 4.51238 15.9951 4.47322 16.083C4.43405 16.1709 4.41299 16.2658 4.4113 16.362C4.4096 16.4582 4.4273 16.5537 4.46334 16.643C4.49937 16.7322 4.55302 16.8132 4.62106 16.8813C4.6891 16.9493 4.77015 17.003 4.85937 17.039C4.9486 17.075 5.04417 17.0927 5.14038 17.091C5.23659 17.0893 5.33147 17.0683 5.41937 17.0291C5.50727 16.99 5.58637 16.9335 5.65197 16.8631C6.00547 16.5106 6.3112 16.1274 6.56916 15.7233C7.60815 16.398 8.59644 17.1478 9.52612 17.9666C9.65701 18.082 9.82551 18.1457 10 18.1457C10.1745 18.1457 10.343 18.082 10.4739 17.9666C12.1842 16.4598 14.0899 15.1904 16.1394 14.1928C16.2699 14.1295 16.3781 14.0281 16.4497 13.9021C16.5214 13.776 16.5531 13.6312 16.5407 13.4867C16.4544 12.4906 16.3301 11.4982 16.1681 10.5116C14.4282 11.2377 12.7644 12.1341 11.2009 13.1877C10.8461 13.4267 10.4279 13.5544 10 13.5544C9.57211 13.5544 9.15395 13.4267 8.79906 13.1877C8.40735 12.9249 8.0099 12.6708 7.60481 12.4262C7.55492 13.5968 7.19773 14.7346 6.56916 15.7233C6.16831 15.4634 5.76019 15.2139 5.34529 14.9771C5.89043 14.1295 6.17969 13.1426 6.1784 12.1348V11.6189V11.6179Z"
        className={
          iconColorClassName ||
          "tw-fill-medusa-icon-subtle dark:tw-fill-medusa-icon-subtle-dark"
        }
      />
    </svg>
  )
}

export default IconAcademicCapSolid
