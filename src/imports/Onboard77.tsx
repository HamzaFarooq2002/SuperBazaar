import svgPaths from "./svg-tdfaetp6id";
import imgRoundedRectangle from "figma:asset/4f534f4d707fe98f4688f56e0af313e6f8268428.png";
import imgRectangle12 from "figma:asset/f0f994306ccc13bbde94c4548819ac2723c4ab48.png";
import imgImage1 from "figma:asset/7279c83fe30c7ee3df92e0a2f3760ff68c7dae1b.png";
import imgEllipse14 from "figma:asset/3c894515acf31e8faa5d010be5ba1e61808c68a9.png";
import imgRectangle10 from "figma:asset/9c0ff4bb418a9957a7a62730a8d7134def18a19d.png";
import imgEllipse15 from "figma:asset/28cf7d13d38347fecb5fb2cac86578a421423b9c.png";
import imgEllipse17 from "figma:asset/08d308ec4c09ae7c9c8f432f2b8596c05b4928da.png";
import imgEllipse18 from "figma:asset/602c38c8eecd54e9d7cfb68da3c431ae1576779a.png";

function HomeIndicator() {
  return (
    <div className="absolute bottom-[-332px] h-[34px] left-[calc(50%+1208px)] translate-x-[-50%] w-[375px]" data-name="Home Indicator">
      <div className="absolute bg-black bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function WellVerifyYourCnic() {
  return (
    <div className="absolute h-[36px] left-[21px] top-[189px] w-[326px]" data-name="We’ll verify your CNIC">
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[36px] justify-center leading-[0] left-1/2 not-italic text-[#e1f4e3] text-[20px] text-center top-1/2 tracking-[-0.2px] translate-x-[-50%] translate-y-[-50%] w-[246px]">
        <p className="leading-[1.5]">Welcome To SuperBazaar</p>
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
    <div className="bg-white relative size-full" data-name="Onboard 7/7">
      <div className="absolute h-[812px] left-[-5px] rounded-[1px] top-0 w-[384px]" data-name="Rounded rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[1px] size-full" src={imgRoundedRectangle} />
      </div>
      <HomeIndicator />
      <WellVerifyYourCnic />
      <StatusBar />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[29px] leading-[1.5] left-[187px] not-italic text-[#e1f4e3] text-[16px] text-center top-[231px] translate-x-[-50%] w-[372px]">Your account is ready</p>
      <div className="absolute left-[65px] rounded-[37px] size-[242px] top-[281px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[37px] size-full" src={imgRectangle12} />
      </div>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[27px] leading-[1.5] left-[192px] not-italic text-[15px] text-center text-white top-[317px] tracking-[0.6px] translate-x-[-50%] w-[166px]">Your Rewards</p>
      <div className="absolute h-[25px] left-[109px] top-[315px] w-[30px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[38px] leading-[1.5] left-[189.5px] not-italic text-[32px] text-center text-white top-[336px] tracking-[1.28px] translate-x-[-50%] w-[101px]">40%</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[8px] leading-[1.5] left-[186px] not-italic text-[11px] text-center text-white top-[378px] tracking-[0.44px] translate-x-[-50%] w-[242px]">SNPL Discount Unlocked</p>
      <div className="absolute h-0 left-[80px] top-[412px] w-[205px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 205 1">
            <line id="Line 1" stroke="var(--stroke-0, white)" x2="205" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[11px] leading-[1.5] left-[191px] not-italic text-[#e1f4e3] text-[11px] text-center top-[428px] tracking-[0.44px] translate-x-[-50%] w-[164px]">Identity verified with NADRA</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[11px] leading-[1.5] left-[182px] not-italic text-[#e1f4e3] text-[11px] text-center top-[458px] tracking-[0.44px] translate-x-[-50%] w-[164px]">Mobile number confirmed</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[11px] leading-[1.5] left-[191px] not-italic text-[#e1f4e3] text-[11px] text-center top-[488px] tracking-[0.44px] translate-x-[-50%] w-[164px]">Business documents verified</p>
      <div className="absolute left-[94px] size-[10px] top-[433px]">
        <img alt="" className="block max-w-none size-full" height="10" src={imgEllipse14} width="10" />
      </div>
      <div className="absolute left-[94px] size-[10px] top-[463px]">
        <img alt="" className="block max-w-none size-full" height="10" src={imgEllipse14} width="10" />
      </div>
      <div className="absolute left-[94px] size-[10px] top-[493px]">
        <img alt="" className="block max-w-none size-full" height="10" src={imgEllipse14} width="10" />
      </div>
      <div className="absolute h-[59px] left-[calc(50%+6px)] opacity-[0.74] rounded-[10px] top-[557px] translate-x-[-50%] w-[333px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-80 pointer-events-none rounded-[10px] size-full" src={imgRectangle10} />
      </div>
      <div className="absolute left-[44px] size-[24px] top-[575px]">
        <img alt="" className="block max-w-none size-full" height="24" src={imgEllipse15} width="24" />
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[1.5] left-[calc(50%+4.5px)] not-italic text-[#e1f4e3] text-[12px] text-center top-[578px] tracking-[0.48px] translate-x-[-50%] w-[244px]">Browse suppliers and get SNPL terms</p>
      <div className="absolute h-[59px] left-[calc(50%+6px)] opacity-[0.74] rounded-[10px] top-[637px] translate-x-[-50%] w-[333px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-80 pointer-events-none rounded-[10px] size-full" src={imgRectangle10} />
      </div>
      <div className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[1.5] left-[calc(50%+1.5px)] not-italic text-[#e1f4e3] text-[12px] text-center top-[655px] tracking-[0.48px] translate-x-[-50%] w-[288px]">
        <p className="mb-0">{`Build your credit score with every `}</p>
        <p>transaction</p>
      </div>
      <div className="absolute left-[44px] size-[24px] top-[655px]">
        <img alt="" className="block max-w-none size-full" height="24" src={imgEllipse17} width="24" />
      </div>
      <div className="absolute left-[146px] size-[84px] top-[85px]">
        <img alt="" className="block max-w-none size-full" height="84" src={imgEllipse18} width="84" />
      </div>
      <div className="absolute bg-white h-[43px] left-[27px] rounded-[10px] top-[735px] w-[333px]" data-name="Rounded rectangle" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[1.5] left-[194.5px] not-italic text-[#376df7] text-[15px] text-center top-[745px] tracking-[0.6px] translate-x-[-50%] w-[251px]">Go to Dashboard</p>
    </div>
  );
}