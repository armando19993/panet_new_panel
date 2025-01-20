import { instanceWithToken } from "@/utils/instance";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailTransactionPage = () => {
  const { idtrasaction } = useParams();
  const getTransactions =()=>{
    instanceWithToken.get(`transaction/${idtrasaction}`)
    .then((result) => {
        console.log(result.data.data)
    })

  }

  useEffect(()=>{
    getTransactions()
  },[])

  return <div>{idtrasaction}</div>;
};

export default DetailTransactionPage;
