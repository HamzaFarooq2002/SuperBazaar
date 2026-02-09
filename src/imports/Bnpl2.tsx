import svgPaths from "./svg-1r4fyijtm3";
import imgDepth3Frame0 from "figma:asset/1f2417032d4fb4078ffab4c689f657ede6100ea1.png";

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
    <div className="basis-0 grow h-[23px] min-h-px min-w-px relative shrink-0" data-name="Depth 3, Frame 1">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[23px] items-center pl-0 pr-[48px] py-0 relative w-full">
          <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[23px] relative shrink-0 text-[#121714] text-[18px] text-center w-full">Loan Approval</p>
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
    <div className="h-[102px] relative shrink-0 w-full" data-name="Depth 2, Frame 1">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[102px] items-center pb-[12px] pt-[20px] px-[16px] relative w-full">
          <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[35px] relative shrink-0 text-[#121714] text-[28px] text-center w-full">{`Congratulations! You're Approved.`}</p>
        </div>
      </div>
    </div>
  );
}

function Depth6Frame() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 6, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[14px] text-white w-full">Loan Amount</p>
      </div>
    </div>
  );
}

function Depth6Frame1() {
  return (
    <div className="max-w-[440px] relative shrink-0 w-full" data-name="Depth 6, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start max-w-inherit relative w-full">
        <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[30px] relative shrink-0 text-[24px] text-white w-full">$1,500</p>
      </div>
    </div>
  );
}

function Depth6Frame2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 6, Frame 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <p className="font-['Manrope:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-white w-full">4 Interest-Free Installments</p>
      </div>
    </div>
  );
}

function Depth5Frame() {
  return (
    <div className="basis-0 grow max-w-[440px] min-h-px min-w-px relative shrink-0" data-name="Depth 5, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] items-start max-w-inherit relative w-full">
        <Depth6Frame />
        <Depth6Frame1 />
        <Depth6Frame2 />
      </div>
    </div>
  );
}

function Depth4Frame1() {
  return (
    <div className="absolute box-border content-stretch flex items-end justify-between left-[16px] p-[16px] top-[322px] w-[358px]" data-name="Depth 4, Frame 0">
      <Depth5Frame />
    </div>
  );
}

function Depth3Frame2() {
  return (
    <div className="h-[247px] relative rounded-[12px] shrink-0 w-full" data-name="Depth 3, Frame 0">
      <div aria-hidden="true" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 pointer-events-none rounded-[12px]">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border max-w-none object-50%-50% object-cover rounded-[12px] size-full" src={imgDepth3Frame0} />
        <div className="absolute bg-clip-padding bg-gradient-to-t border-0 border-[transparent] border-solid box-border from-[rgba(0,0,0,0.4)] inset-0 rounded-[12px] to-[rgba(0,0,0,0)]" />
      </div>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[247px] overflow-clip relative rounded-[inherit] w-full">
        <Depth4Frame1 />
        <p className="absolute font-['Manrope:ExtraBold',sans-serif] font-extrabold h-[76px] leading-[24px] left-[calc(50%-96px)] text-[32px] text-white top-[81px] w-[192px]">HOORAY</p>
      </div>
    </div>
  );
}

function Depth2Frame2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 2">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start p-[16px] relative w-full">
          <Depth3Frame2 />
        </div>
      </div>
    </div>
  );
}

function Depth4Frame2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Depth 4, Frame 0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_37_1120)" id="Depth 4, Frame 0">
          <path clipRule="evenodd" d={svgPaths.p1316b170} fill="var(--fill-0, #121714)" fillRule="evenodd" id="Vector - 0" />
          <g id="Depth 5, Frame 0"></g>
        </g>
        <defs>
          <clipPath id="clip0_37_1120">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Depth3Frame3() {
  return (
    <div className="bg-[#f0f5f2] relative rounded-[8px] shrink-0 size-[40px]" data-name="Depth 3, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Depth4Frame2 />
      </div>
    </div>
  );
}

function Depth3Frame4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Depth 3, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <p className="[white-space-collapse:collapse] font-['Manrope:Regular',sans-serif] font-normal leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#121714] text-[16px] text-nowrap w-full">No Fees</p>
      </div>
    </div>
  );
}

function Depth2Frame3() {
  return (
    <div className="bg-white h-[56px] min-h-[56px] relative shrink-0 w-full" data-name="Depth 2, Frame 3">
      <div className="flex flex-row items-center min-h-inherit size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[56px] items-center min-h-inherit px-[16px] py-0 relative w-full">
          <Depth3Frame3 />
          <Depth3Frame4 />
        </div>
      </div>
    </div>
  );
}

function Depth4Frame3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Depth 4, Frame 0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_37_1112)" id="Depth 4, Frame 0">
          <path clipRule="evenodd" d={svgPaths.p25254100} fill="var(--fill-0, #121714)" fillRule="evenodd" id="Vector - 0" />
          <g id="Depth 5, Frame 0"></g>
        </g>
        <defs>
          <clipPath id="clip0_37_1112">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Depth3Frame5() {
  return (
    <div className="bg-[#f0f5f2] relative rounded-[8px] shrink-0 size-[40px]" data-name="Depth 3, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Depth4Frame3 />
      </div>
    </div>
  );
}

function Depth3Frame6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Depth 3, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <p className="[white-space-collapse:collapse] font-['Manrope:Regular',sans-serif] font-normal leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#121714] text-[16px] text-nowrap w-full">First payment due in 30 days</p>
      </div>
    </div>
  );
}

function Depth2Frame4() {
  return (
    <div className="bg-white h-[56px] min-h-[56px] relative shrink-0 w-full" data-name="Depth 2, Frame 4">
      <div className="flex flex-row items-center min-h-inherit size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[56px] items-center min-h-inherit px-[16px] py-0 relative w-full">
          <Depth3Frame5 />
          <Depth3Frame6 />
        </div>
      </div>
    </div>
  );
}

function Depth4Frame4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Depth 4, Frame 0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_37_1116)" id="Depth 4, Frame 0">
          <path clipRule="evenodd" d={svgPaths.p1a985c00} fill="var(--fill-0, #121714)" fillRule="evenodd" id="Vector - 0" />
          <g id="Depth 5, Frame 0"></g>
        </g>
        <defs>
          <clipPath id="clip0_37_1116">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Depth3Frame7() {
  return (
    <div className="bg-[#f0f5f2] relative rounded-[8px] shrink-0 size-[40px]" data-name="Depth 3, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Depth4Frame4 />
      </div>
    </div>
  );
}

function Depth3Frame8() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Depth 3, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <p className="[white-space-collapse:collapse] font-['Manrope:Regular',sans-serif] font-normal leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#121714] text-[16px] text-nowrap w-full">Secure</p>
      </div>
    </div>
  );
}

function Depth2Frame5() {
  return (
    <div className="bg-white h-[56px] min-h-[56px] relative shrink-0 w-full" data-name="Depth 2, Frame 5">
      <div className="flex flex-row items-center min-h-inherit size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[56px] items-center min-h-inherit px-[16px] py-0 relative w-full">
          <Depth3Frame7 />
          <Depth3Frame8 />
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
      </div>
    </div>
  );
}

function Depth4Frame5() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit]">
        <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#121714] text-[16px] text-center text-nowrap w-full whitespace-pre">{`Accept Offer & Continue`}</p>
      </div>
    </div>
  );
}

function Depth3Frame9() {
  return (
    <div className="basis-0 bg-[#38e07a] grow h-[48px] max-w-[480px] min-h-px min-w-[84px] relative rounded-[12px] shrink-0" data-name="Depth 3, Frame 0">
      <div className="flex flex-row items-center justify-center max-w-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[48px] items-center justify-center max-w-inherit min-w-inherit px-[20px] py-0 relative w-full">
          <Depth4Frame5 />
        </div>
      </div>
    </div>
  );
}

function Depth2Frame6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 0">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start px-[16px] py-[12px] relative w-full">
          <Depth3Frame9 />
        </div>
      </div>
    </div>
  );
}

function Depth2Frame7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 1">
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center pb-[12px] pt-[4px] px-[16px] relative w-full">
          <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#638773] text-[14px] text-center w-full">See Full Terms</p>
        </div>
      </div>
    </div>
  );
}

function Depth2Frame8() {
  return (
    <div className="bg-white h-[20px] relative shrink-0 w-full" data-name="Depth 2, Frame 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] w-full" />
    </div>
  );
}

function Depth1Frame1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 1, Frame 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Depth2Frame6 />
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
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="BNPL 2">
      <Depth0Frame />
    </div>
  );
}