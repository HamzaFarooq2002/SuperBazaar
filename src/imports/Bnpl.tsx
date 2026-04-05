import svgPaths from "./svg-216bics290";

function Depth4Frame() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Depth 4, Frame 0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_37_1046)" id="Depth 4, Frame 0">
          <path clipRule="evenodd" d={svgPaths.pff1400} fill="var(--fill-0, #121714)" fillRule="evenodd" id="Vector - 0" />
          <g id="Depth 5, Frame 0"></g>
        </g>
        <defs>
          <clipPath id="clip0_37_1046">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Depth3Frame() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Depth 3, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center relative size-[48px]">
        <Depth4Frame />
      </div>
    </div>
  );
}

function Depth3Frame1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Depth 3, Frame 1">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center pl-0 pr-[48px] py-0 relative w-full">
          <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[23px] relative shrink-0 text-[#121714] text-[18px] text-center w-full">Checkout</p>
        </div>
      </div>
    </div>
  );
}

function Depth2Frame() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Depth 2, Frame 0">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-between pb-[8px] pt-[16px] px-[16px] relative w-full">
          <Depth3Frame />
          <Depth3Frame1 />
        </div>
      </div>
    </div>
  );
}

function Depth2Frame1() {
  return (
    <div className="h-[67px] relative shrink-0 w-full" data-name="Depth 2, Frame 1">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[67px] items-center pb-[12px] pt-[20px] px-[16px] relative w-full">
          <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[35px] relative shrink-0 text-[#121714] text-[28px] text-center w-full">{`You're approved!`}</p>
        </div>
      </div>
    </div>
  );
}

function Depth2Frame2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 2">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center pb-[12px] pt-[4px] px-[16px] relative w-full">
          <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#121714] text-[16px] text-center w-full">Your purchase is approved with Buy Now, Pay Later. Review your payment plan below.</p>
        </div>
      </div>
    </div>
  );
}

function Depth4Frame2() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121714] text-[16px] w-full">Product Name</p>
      </div>
    </div>
  );
}

function Depth4Frame1() {
  return (
    <div className="relative shrink-0 w-[107px]" data-name="Depth 4, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-[107px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#638773] text-[14px] w-full">RS. 4000</p>
      </div>
    </div>
  );
}

function Depth3Frame2() {
  return (
    <div className="relative shrink-0" data-name="Depth 3, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-center relative">
        <Depth4Frame2 />
        <Depth4Frame1 />
      </div>
    </div>
  );
}

function Depth2Frame3() {
  return (
    <div className="bg-white h-[72px] min-h-[72px] relative shrink-0 w-full" data-name="Depth 2, Frame 3">
      <div className="flex flex-row items-center min-h-inherit size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[72px] items-center min-h-inherit px-[16px] py-[8px] relative w-full">
          <Depth3Frame2 />
        </div>
      </div>
    </div>
  );
}

function Depth2Frame4() {
  return (
    <div className="h-[47px] relative shrink-0 w-full" data-name="Depth 2, Frame 4">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[47px] items-start pb-[8px] pt-[16px] px-[16px] relative w-full">
          <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[23px] relative shrink-0 text-[#121714] text-[18px] w-full">Payment Plan</p>
        </div>
      </div>
    </div>
  );
}

function Depth4Frame3() {
  return (
    <div className="relative shrink-0 w-[235px]" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-[235px]">
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121714] text-[16px] w-full">Buy Now, Pay Later</p>
      </div>
    </div>
  );
}

function Depth4Frame4() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#638773] text-[14px] w-full">4 interest-free payments of RS. 1000</p>
      </div>
    </div>
  );
}

function Depth3Frame3() {
  return (
    <div className="relative shrink-0" data-name="Depth 3, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-center relative">
        <Depth4Frame3 />
        <Depth4Frame4 />
      </div>
    </div>
  );
}

function Depth2Frame5() {
  return (
    <div className="bg-white h-[72px] min-h-[72px] relative shrink-0 w-full" data-name="Depth 2, Frame 5">
      <div className="flex flex-row items-center min-h-inherit size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[72px] items-center min-h-inherit px-[16px] py-[8px] relative w-full">
          <Depth3Frame3 />
        </div>
      </div>
    </div>
  );
}

function Depth6Frame() {
  return (
    <div className="relative shrink-0 w-[72px]" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-[72px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#638773] text-[14px] w-full">Payment 1</p>
      </div>
    </div>
  );
}

function Depth5Frame1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 5, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start relative w-full">
        <Depth6Frame />
      </div>
    </div>
  );
}

function Depth6Frame1() {
  return (
    <div className="relative shrink-0 w-[72px]" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-[72px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#121714] text-[14px] w-full">RS. 1000 - Due July 15</p>
      </div>
    </div>
  );
}

function Depth5Frame() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 5, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start relative w-full">
        <Depth6Frame1 />
      </div>
    </div>
  );
}

function Depth4Frame5() {
  return (
    <div className="h-full relative shrink-0 w-[72px]" data-name="Depth 4, Frame 0">
      <div aria-hidden="true" className="absolute border-[#e5e8eb] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start pb-[20px] pt-[21px] px-0 relative w-[72px]">
        <Depth5Frame1 />
        <Depth5Frame />
      </div>
    </div>
  );
}

function Depth6Frame2() {
  return (
    <div className="h-full relative shrink-0 w-[262px]" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start relative w-[262px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#638773] text-[14px] w-full">Payment 2</p>
      </div>
    </div>
  );
}

function Depth5Frame2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Depth 5, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start relative size-full">
        <Depth6Frame2 />
      </div>
    </div>
  );
}

function Depth6Frame3() {
  return (
    <div className="h-full relative shrink-0 w-[262px]" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start relative w-[262px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#121714] text-[14px] w-full">RS. 1000 - Due August 15</p>
      </div>
    </div>
  );
}

function Depth5Frame3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Depth 5, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start relative size-full">
        <Depth6Frame3 />
      </div>
    </div>
  );
}

function Depth4Frame6() {
  return (
    <div className="h-full relative shrink-0 w-[262px]" data-name="Depth 4, Frame 1">
      <div aria-hidden="true" className="absolute border-[#e5e8eb] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start pb-[20px] pt-[21px] px-0 relative w-[262px]">
        <Depth5Frame2 />
        <Depth5Frame3 />
      </div>
    </div>
  );
}

function Depth3Frame4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Depth 3, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[24px] items-start relative size-full">
        <Depth4Frame5 />
        <Depth4Frame6 />
      </div>
    </div>
  );
}

function Depth6Frame4() {
  return (
    <div className="relative shrink-0 w-[72px]" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-[72px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#638773] text-[14px] w-full">Payment 3</p>
      </div>
    </div>
  );
}

function Depth5Frame4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 5, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start relative w-full">
        <Depth6Frame4 />
      </div>
    </div>
  );
}

function Depth6Frame5() {
  return (
    <div className="relative shrink-0 w-[72px]" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-[72px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#121714] text-[14px] w-full">RS. 1000 - Due September 15</p>
      </div>
    </div>
  );
}

function Depth5Frame5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 5, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start relative w-full">
        <Depth6Frame5 />
      </div>
    </div>
  );
}

function Depth4Frame7() {
  return (
    <div className="h-full relative shrink-0 w-[72px]" data-name="Depth 4, Frame 0">
      <div aria-hidden="true" className="absolute border-[#e5e8eb] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start pb-[20px] pt-[21px] px-0 relative w-[72px]">
        <Depth5Frame4 />
        <Depth5Frame5 />
      </div>
    </div>
  );
}

function Depth6Frame6() {
  return (
    <div className="h-full relative shrink-0 w-[262px]" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start relative w-[262px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#638773] text-[14px] w-full">Payment 4</p>
      </div>
    </div>
  );
}

function Depth5Frame6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Depth 5, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start relative size-full">
        <Depth6Frame6 />
      </div>
    </div>
  );
}

function Depth6Frame7() {
  return (
    <div className="h-full relative shrink-0 w-[262px]" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start relative w-[262px]">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#121714] text-[14px] w-full">RS. 1000 - Due October 15</p>
      </div>
    </div>
  );
}

function Depth5Frame7() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Depth 5, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start relative size-full">
        <Depth6Frame7 />
      </div>
    </div>
  );
}

function Depth4Frame8() {
  return (
    <div className="h-full relative shrink-0 w-[262px]" data-name="Depth 4, Frame 1">
      <div aria-hidden="true" className="absolute border-[#e5e8eb] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start pb-[20px] pt-[21px] px-0 relative w-[262px]">
        <Depth5Frame6 />
        <Depth5Frame7 />
      </div>
    </div>
  );
}

function Depth3Frame5() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Depth 3, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[24px] items-start relative size-full">
        <Depth4Frame7 />
        <Depth4Frame8 />
      </div>
    </div>
  );
}

function Depth2Frame6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 6">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[24px] items-start p-[16px] relative w-full">
          <Depth3Frame4 />
          <Depth3Frame5 />
        </div>
      </div>
    </div>
  );
}

function Depth1Frame() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 1, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Depth2Frame />
        <Depth2Frame1 />
        <Depth2Frame2 />
        <Depth2Frame3 />
        <Depth2Frame4 />
        <Depth2Frame5 />
        <Depth2Frame6 />
      </div>
    </div>
  );
}

function Depth4Frame9() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit]">
        <p className="[white-space-collapse:collapse] font-['Manrope:Bold',sans-serif] font-bold leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#121714] text-[16px] text-center text-nowrap w-full">{`Confirm & Pay`}</p>
      </div>
    </div>
  );
}

function Depth3Frame6() {
  return (
    <div className="basis-0 bg-[#38e07a] grow h-[48px] max-w-[480px] min-h-px min-w-[84px] relative rounded-[12px] shrink-0" data-name="Depth 3, Frame 0">
      <div className="flex flex-row items-center justify-center max-w-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[48px] items-center justify-center max-w-inherit min-w-inherit px-[20px] py-0 relative w-full">
          <Depth4Frame9 />
        </div>
      </div>
    </div>
  );
}

function Depth2Frame7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 0">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start px-[16px] py-[12px] relative w-full">
          <Depth3Frame6 />
        </div>
      </div>
    </div>
  );
}

function Depth2Frame8() {
  return (
    <div className="bg-white h-[20px] relative shrink-0 w-full" data-name="Depth 2, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] w-full" />
    </div>
  );
}

function Depth1Frame1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 1, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Depth2Frame7 />
        <Depth2Frame8 />
      </div>
    </div>
  );
}

function Depth0Frame() {
  return (
    <div className="bg-white min-h-[844px] relative shrink-0 w-full" data-name="Depth 0, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-between min-h-inherit overflow-clip relative rounded-[inherit] w-full">
        <Depth1Frame />
        <Depth1Frame1 />
      </div>
    </div>
  );
}

export default function Bnpl() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="BNPL">
      <Depth0Frame />
    </div>
  );
}