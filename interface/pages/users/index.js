import axios from "axios";
import User from "../../components/user";
import Empty from "../../components/empty";

const Users = ({ users }) => {
    return (
        <div className="flex flex-wrap gap-3 p-4">
            {
                users.map((item, idx) => (
                    <User
                        key={idx}
                        address={item.address}
                    />
                ))
            }
            {
                !users && <Empty/>
            }
        </div>
    )
}

export async function getStaticProps() {
    const users = await axios.post(`${process.env.backend}/users/get-list`).then(res => {
        const { list } = res.data;
        return list;
    }).catch(err => {
        return [];
    })

    return {
        props: {
            users
        }
    }
}

export default Users;