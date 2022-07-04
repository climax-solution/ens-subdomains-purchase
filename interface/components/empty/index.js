const Empty = ({ text }) => (
    <div
        className="flex items-center justify-center
        border border-gray-300 rounded-lg h-52 p-16
        w-1/2 mx-auto shadow-lg"
    >
        <h3 className="text-gray-300 text-lg font-bold text-center">{ text ? text : "No items to display."}</h3>
    </div>
)

export default Empty;