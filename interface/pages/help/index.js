const Help = () => {
    return (
        <div className="flex flex-col justify-center text-white px-4 pt-8 pb-3">
            <h1 className="text-center text-5xl	font-bold mt-8">How to add ETH address to your subdomain</h1>
            <div className="content text-xl mt-8 px-12">
                <p>Go to app.ens.domains</p>
                <p>Top left corner, click on “connect” and connect your MetaMask account.</p>
                <img
                    src="/help/1.png"
                    className="mx-auto my-8"
                />
                <p>Top right corner, click on “My Account”</p>
                <img
                    src="/help/2.png"
                    className="mx-auto my-8"
                />
                <p>Once you are in your account, click on “controller”</p>
                <img
                    src="/help/3.png"
                    className="mx-auto my-8"
                />
                <p>After clicking on controller, you should see your subdomain and click on it.</p>
                <img
                    src="/help/4.png"
                    className="mx-auto my-8"
                />
                <p>After clicking on your subdomain, click on “add/edit record” and copy/paste your ETH address that you wish to connect to this subdomain then click confirm.</p>
                <img
                    src="/help/5.png"
                    className="mx-auto my-8"
                />
            </div>
        </div>
    )
}

export default Help;