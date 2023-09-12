const ICON = "🔔"
const Notifications = () => {
  const hasNotifications = true
  return (
    <>
        <span className={'text-white font-emoji text-3xl bg-action-div p-[0.5em] inline-block align-middle sticky top-14 cursor-pointer'}>
          {ICON}
          {hasNotifications && <div className={'bg-notification inline-block w-[0.25em] h-[0.25em] rounded-full absolute top-5 right-6'}></div>}
        </span>
    </>
  )
}

export default Notifications