const ReviewLoader = () => {
    return (
        <article className="mt-4">
            <div className="flex items-center mb-4 space-x-4">
                <span className="bg-white w-14 h-14 rounded-full border-2 p-2 animate-pulse"/>
                <div className="space-y-1 font-medium dark:text-white">
                    <p className="text-white flex flex-col gap-2"><span className="animate-pulse w-48 h-4 bg-white rounded-md"/><time className="animate-pulse w-48 h-4 bg-white rounded-md"/></p>
                </div>
            </div>
            <span className="animate-pulse w-48 h-4 bg-white rounded-md inline-block mr-2"/>
            <span className="animate-pulse w-48 h-4 bg-white rounded-md inline-block"/><br/>
            <footer className="mb-5 text-sm text-white dark:text-white"><span className="animate-pulse w-48 h-4 bg-white rounded-md"/></footer>
            <p className="mb-2 font-light bg-white h-24 p-4 border rounded-lg animate-pulse"/>
        </article>
    )
}

export default ReviewLoader;