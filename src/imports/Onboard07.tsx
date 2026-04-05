import svgPaths from "./svg-x49oujuasg";
import imgRoundedRectangle from "figma:asset/4f534f4d707fe98f4688f56e0af313e6f8268428.png";
import imgRectangle10 from "figma:asset/9c0ff4bb418a9957a7a62730a8d7134def18a19d.png";
import imgEllipse20 from "figma:asset/234eb96d22d5e7e1c68254253a918dbfa50a7463.png";
import imgEllipse21 from "figma:asset/a34cf77ad76b71421fd2186097a15eb1e3a26d6a.png";

function HomeIndicator() {
  return (
    <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-[375px]" data-name="Home Indicator">
      <div className="absolute bg-black bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[10px] leading-[1.5] left-[193px] not-italic text-[10px] text-center text-white top-[-1px] tracking-[0.4px] translate-x-[-50%] w-[302px]">Join thousands of businesses growing with SuperBazaar</p>
    </div>
  );
}

function WellVerifyYourCnic() {
  return (
    <div className="absolute h-[36px] left-[21px] top-[179px] w-[326px]" data-name="We’ll verify your CNIC">
      <div className="absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[36px] justify-center leading-[0] left-1/2 not-italic text-[#e1f4e3] text-[36px] text-center top-1/2 tracking-[-0.36px] translate-x-[-50%] translate-y-[-50%] w-[246px]">
        <p className="leading-[1.5]">SuperBazaar</p>
      </div>
    </div>
  );
}

function RightSide() {
  return (
    <div className="absolute h-[11.336px] right-[14.67px] top-[17.33px] w-[66.661px]" data-name="Right Side">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 12">
        <g id="Right Side">
          <g id="Battery">
            <path d={svgPaths.p284dc240} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, #E1F4E3)" />
            <path d={svgPaths.p3b01f0e0} fill="var(--fill-0, #E1F4E3)" id="Combined Shape" opacity="0.4" />
            <path d={svgPaths.p11b4bf10} fill="var(--fill-0, #E1F4E3)" id="Rectangle_2" />
          </g>
          <path d={svgPaths.pc434800} fill="var(--fill-0, #E1F4E3)" id="Wifi" />
          <path d={svgPaths.p28a9ed00} fill="var(--fill-0, #E1F4E3)" id="Mobile Signal" />
        </g>
      </svg>
    </div>
  );
}

function Time() {
  return (
    <div className="absolute h-[21px] left-[21px] top-[12px] w-[54px]" data-name="Time">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 21">
        <g id="Time">
          <g id="9:41">
            <path d={svgPaths.p24372f50} fill="var(--fill-0, #E1F4E3)" />
            <path d={svgPaths.p3aa84e00} fill="var(--fill-0, #E1F4E3)" />
            <path d={svgPaths.p2e6b3780} fill="var(--fill-0, #E1F4E3)" />
            <path d={svgPaths.p12b0b900} fill="var(--fill-0, #E1F4E3)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="absolute contents left-[21px] top-[12px]" data-name="Left Side">
      <Time />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip top-0 w-[375px]" data-name="Status Bar">
      <RightSide />
      <LeftSide />
    </div>
  );
}

export default function Onboard() {
  return (
    <div className="bg-white relative size-full" data-name="Onboard 0/7">
      <div className="absolute h-[812px] left-0 top-0 w-[375px]" data-name="Rounded rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgRoundedRectangle} />
      </div>
      <HomeIndicator />
      <WellVerifyYourCnic />
      <StatusBar />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[29px] leading-[1.5] left-[187px] not-italic text-[#e1f4e3] text-[16px] text-center top-[231px] translate-x-[-50%] w-[372px]">{`Empowering SMEs & Suppliers`}</p>
      <div className="absolute h-[79px] left-[calc(50%+6px)] opacity-[0.74] pointer-events-none rounded-[10px] top-[317px] translate-x-[-50%] w-[333px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-80 rounded-[10px] size-full" src={imgRectangle10} />
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.18)] border-solid inset-0 rounded-[10px]" />
      </div>
      <div className="absolute left-[43px] size-[28px] top-[337px]">
        <img alt="" className="block max-w-none size-full" height="28" src={imgEllipse20} width="28" />
      </div>
      <div className="absolute bg-white h-[43px] left-[27px] rounded-[10px] top-[731px] w-[333px]" data-name="Rounded rectangle" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[1.5] left-[194.5px] not-italic text-[#376df7] text-[15px] text-center top-[741px] tracking-[0.6px] translate-x-[-50%] w-[251px]">Get Started</p>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[1.5] left-[calc(50%+10px)] not-italic text-[14px] text-center text-white top-[328px] tracking-[0.56px] translate-x-[-50%] w-[187px]">Supply Now, Pay Later</p>
      <div className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.5] left-[calc(50%+24px)] not-italic text-[12px] text-center text-white top-[352px] tracking-[0.48px] translate-x-[-50%] w-[271px]">
        <p className="mb-0">Access inventory without upfront</p>
        <p>{` payment. Flexible repayment terms.`}</p>
      </div>
      <div className="absolute h-[79px] left-[calc(50%+6px)] opacity-[0.74] pointer-events-none rounded-[10px] top-[427px] translate-x-[-50%] w-[333px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-80 rounded-[10px] size-full" src={imgRectangle10} />
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.18)] border-solid inset-0 rounded-[10px]" />
      </div>
      <div className="absolute left-[43px] size-[28px] top-[447px]">
        <img alt="" className="block max-w-none size-full" height="28" src={imgEllipse21} width="28" />
      </div>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[1.5] left-[calc(50%+10px)] not-italic text-[14px] text-center text-white top-[438px] tracking-[0.56px] translate-x-[-50%] w-[187px]">{`Credit Scoring & Loans`}</p>
      <div className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.5] left-[calc(50%+24px)] not-italic text-[12px] text-center text-white top-[462px] tracking-[0.48px] translate-x-[-50%] w-[235px]">
        <p className="mb-0">{`Build your credit score and access `}</p>
        <p>business loans through open banking.</p>
      </div>
    </div>
  );
}