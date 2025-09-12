export default function BaseButton(props: {
  type?: HTMLButtonElement["type"],
  disabled?: HTMLButtonElement["disabled"],
  onClick?: () => void,
  children: React.ReactNode,
}) {
  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      className="hover:cursor-pointer disabled:opacity-50 disabled:hover:bg-indigo-500 disabled:cursor-default rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-500 shadow-none hover:bg-indigo-400 focus-visible:outline-indigo-500"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
