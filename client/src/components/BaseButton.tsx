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
      className="hover:cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
