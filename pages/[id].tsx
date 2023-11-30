import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { useCurrentUser } from "@/hooks/user";

import { NextPage } from "next";
import { RiH1 } from "react-icons/ri";

const UserProfilePage: NextPage = () => {

    const {user} = useCurrentUser();

    return (
        <div>
            <TwitterLayout>
                <div>
                    {user &&<h1>{user.firstName}</h1>}
                </div>
            </TwitterLayout>
        </div>
    )
}
export default UserProfilePage;


