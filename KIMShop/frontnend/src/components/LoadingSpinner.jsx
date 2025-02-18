const LoadingSpinner = () => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-[#1A2027]'>
			<div className='relative'>
				<div className='w-20 h-20 border-[#E0E0E0] border-2 rounded-full' />
				<div className='w-20 h-20 border-[#8C9EFF] border-t-2 animate-spin rounded-full absolute left-0 top-0' />
				<div className='sr-only'>Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
