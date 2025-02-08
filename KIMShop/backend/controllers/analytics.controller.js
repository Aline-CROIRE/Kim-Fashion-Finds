import user from "../models/User.model.js"
import Order from "../models/order.model.js";
import product from "../models/product.model.js"

export const getAnalyticsData= async()=>{

const totalUsers= await user.countDocuments();
const totalProducts= await product.countDocuments()

const salesData= await Order.aggregate([
{
    $group:{
        id: null, // groups all document together
        totalSales:{$sum:1},
        totalRevenue:{$sum:'$totalAmount'}
    }}

])


const {totalSales,totalRevenue}=salesData[0] || {totalSales:0,totalRevenue:0};
return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,

}

}

export  const getDailySalesData=async(startDate,endDate)=>{
   try{
    const dailySalesData= await Order.aggregate([
        {
            $match:{
                createdAt:{
                    $gte:startDate,
                    $lte: endDate,
                },
            },
        },

        {
            $group:{
                _id:{$dateTostring:{format:'%y-%m-%d',date:'$createdAt'}},
                sales:{$sum:1},
                revenue:{$sum: '$totalAmount'},

            },

        },

        {$sort:{_id:1}},
  ]);

      const dateArray=getDateInrange(startDate,endDate);

      return dateArray.map(date=>{
        const foundData=dailySalesData.find(item=>item._id===date);
        return {
            date,
            sales: foundData?.sales || 0,
            revenue: foundData?.revenue || 0,

        }
      })
   }catch(error){

    throw error

   }
}


function getDateInrange(startDate,endDate){
  const dates=[];
  let currentDate= new Date(startDate);

  while(currentDate<=endDate){
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate()+1);

  }

  return dates;

}