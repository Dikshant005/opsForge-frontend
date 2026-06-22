import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {fetchUsers} from './userSlice';
import { useSelector } from 'react-redux';
import { updateUserRole } from './userSlice';

const Users = ()=>{
    
const dispatch = useDispatch();
const users = useSelector((state) => state.users.users);
const status = useSelector((state) => state.users.status);

useEffect(()=>{
    dispatch(fetchUsers());
},[dispatch])

if(status === 'loading'){
    return <div>Loading users...</div>
}

return(
    <ul>
        {users.map(user => (
            <li key={user.id}>{user.name} - {user.email} - 
            {/* role dropdown */}
            <select value={user.role} onChange={(e)=>{
                dispatch(updateUserRole({id:user.id, role:e.target.value}))
            }}>
                <option value="DEV">Developer</option>
                <option value="QA">QA</option>
                <option value="ADMIN">Admin</option>
            </select>
            </li>
        ))}
    </ul>
)

}

export default Users;