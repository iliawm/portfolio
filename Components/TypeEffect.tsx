import GradientText from '@/components/GradientText'

const TypeEffect = () => {
  return (
    <div className='text-white '>
          
    <GradientText
        colors={["#432dd7","#FF9FFC","#5227FF"]}
        animationSpeed={12}
        showBorder={false}
        className="custom-class"
        >
        My portfolio
    </GradientText>
</div>
  )
}

export default TypeEffect