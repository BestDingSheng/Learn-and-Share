function takeLongTime(){
	return new Promise(resolve=>{
		setTimeout(()=>resolve('long-time-valueS'),1000);
	})
}

async function  test(){
	const v=await takeLongTime();
	console.log(v);
}
test();