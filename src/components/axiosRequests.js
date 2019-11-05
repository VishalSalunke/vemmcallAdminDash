import axios from 'axios'

export default async function  managrAPIrequest(requestType,url,body){

    let res = await getRequest(requestType,url,body)

    return res
}

getRequest= async(requestType,url,body)=>{
    let res = await axios.get(`http://localhost:3000/react_api/v1/admin/experiments/experiments`,
                {
                    crossDomain: true,
                    stage_order_hash
                },
                {
                 headers : {
                                 'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
                                 'client' : '6fEfnZkXV5ewZzycrVyRJg',
                                 'uid' : 'vsalunke@quinstreet.com'
                             }
                })

    let { data }  = res
    return data
}
