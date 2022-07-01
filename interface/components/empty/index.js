const Empty = ({ text }) => (
    <div
        className="flex items-center justify-center
        border border-gray-300 rounded-lg h-52 p-16
        w-1/2 mx-auto shadow-lg absolute -translate-y-1/2 -translate-x-1/2 left-2/4 top-2/4"
    >
        <h3 className="text-gray-300 text-lg font-bold text-center">{ text ? text : "No items to display."}</h3>
    </div>
)

export default Empty;