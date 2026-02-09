import svgPaths from "./svg-2pthmw0ane";
import imgRectangle4 from "figma:asset/a9f37960141116dc132cdcd04169283a98871cc6.png";
import imgEllipse1 from "figma:asset/3516678ae60a932655e4139370f999b8fe1a1717.png";
import imgEllipse5 from "figma:asset/72de28af9ea7f055e77f1c571dc9729970d4a558.png";

function HomeIndicator() {
  return (
    <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-[375px]" data-name="Home Indicator">
      <div className="absolute bg-black bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function RightSide() {
  return (
    <div className="absolute h-[11.336px] right-[14.67px] top-[17.33px] w-[66.661px]" data-name="Right Side">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 12">
        <g id="Right Side">
          <g id="Battery">
            <path d={svgPaths.p284dc240} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p3b01f0e0} fill="var(--fill-0, black)" id="Combined Shape" opacity="0.4" />
            <path d={svgPaths.p11b4bf10} fill="var(--fill-0, black)" id="Rectangle_2" />
          </g>
          <path d={svgPaths.pc434800} fill="var(--fill-0, black)" id="Wifi" />
          <path d={svgPaths.p28a9ed00} fill="var(--fill-0, black)" id="Mobile Signal" />
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
            <path d={svgPaths.p24372f50} fill="var(--fill-0, black)" />
            <path d={svgPaths.p3aa84e00} fill="var(--fill-0, black)" />
            <path d={svgPaths.p2e6b3780} fill="var(--fill-0, black)" />
            <path d={svgPaths.p12b0b900} fill="var(--fill-0, black)" />
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

function StatusBar1() {
  return (
    <div className="absolute bg-[#f6f6f6] h-[61px] left-0 overflow-clip top-[49px] w-[375px]" data-name="Status Bar">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[8px] justify-center leading-[0] left-[47.5px] not-italic opacity-[0.58] text-[12px] text-black text-center top-[29px] tracking-[-0.12px] translate-x-[-50%] translate-y-[-50%] w-[135px]">
        <p className="leading-[1.5]">Step 2 of 7</p>
      </div>
      <div className="absolute left-[83px] size-[5px] top-[27px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <circle cx="2.5" cy="2.5" fill="var(--fill-0, #C0C0C0)" id="Ellipse 7" r="2.5" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[8px] justify-center leading-[0] left-[125.5px] not-italic opacity-[0.85] text-[12px] text-black text-center top-[29px] tracking-[-0.12px] translate-x-[-50%] translate-y-[-50%] w-[129px]">
        <p className="leading-[1.5]">User Type</p>
      </div>
      <div className="absolute bg-[#e1f4e3] h-[22px] left-[299px] rounded-[21px] top-[19px] w-[48px]" />
      <div className="absolute flex flex-col font-['Inter:Extra_Light',sans-serif] font-extralight h-[13px] justify-center leading-[0] left-[331px] not-italic text-[#38a829] text-[11px] text-center top-[30.5px] tracking-[-0.11px] translate-x-[-50%] translate-y-[-50%] w-[32px]">
        <p className="leading-[1.5]">10%</p>
      </div>
      <div className="absolute h-[11px] left-[302px] top-[25.4px] w-[16px]">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgRectangle4} />
      </div>
    </div>
  );
}

export default function Onboard() {
  return (
    <div className="bg-white relative size-full" data-name="Onboard 2/7">
      <HomeIndicator />
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[calc(50%-44.5px)] not-italic text-[24px] text-black text-center top-[211px] tracking-[-0.24px] translate-x-[-50%] translate-y-[-50%] w-[244px]">
        <p className="leading-[1.5]">Tell us about yourself</p>
      </div>
      <StatusBar />
      <StatusBar1 />
      <div className="absolute bg-[rgba(236,236,236,0.8)] h-[101px] left-[calc(50%-5px)] rounded-[10px] top-[269px] translate-x-[-50%] w-[337px]" />
      <div className="absolute left-[219px] size-[9px] top-[350px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
          <circle cx="4.5" cy="4.5" fill="var(--fill-0, #95EE74)" id="Ellipse 3" r="4.5" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[1.5] left-[calc(50%+14.5px)] not-italic text-[13px] text-black text-center top-[279px] tracking-[0.52px] translate-x-[-50%] w-[112px]">I’m a Supplier</p>
      <div className="absolute left-[33px] size-[45px] top-[290px]">
        <img alt="" className="block max-w-none size-full" height="45" src={imgEllipse1} width="45" />
      </div>
      <div className="absolute font-['Inter:Regular',sans-serif] font-normal h-[10px] leading-[1.5] left-[209px] not-italic opacity-[0.54] text-[12px] text-black text-center top-[299px] tracking-[0.48px] translate-x-[-50%] w-[352px]">
        <p className="mb-0">I want to supply products to businesses</p>
        <p>{` and offer SNPL terms`}</p>
      </div>
      <p className="absolute font-['Inter:Italic',sans-serif] font-normal h-[13px] italic leading-[1.5] left-[137.5px] opacity-[0.63] text-[10px] text-black text-center top-[347px] tracking-[0.4px] translate-x-[-50%] w-[145px]">Reach more buyers</p>
      <p className="absolute font-['Inter:Italic',sans-serif] font-normal h-[46px] italic leading-[1.5] left-[274.5px] opacity-[0.63] text-[10px] text-black text-center top-[347px] tracking-[0.4px] translate-x-[-50%] w-[129px]">Manage Invoices</p>
      <div className="absolute left-[74px] size-[9px] top-[350px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
          <circle cx="4.5" cy="4.5" fill="var(--fill-0, #95EE74)" id="Ellipse 3" r="4.5" />
        </svg>
      </div>
      <div className="absolute bg-[rgba(236,236,236,0.8)] h-[101px] left-[calc(50%-5px)] rounded-[10px] top-[388px] translate-x-[-50%] w-[337px]" />
      <div className="absolute left-[219px] size-[9px] top-[469px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
          <circle cx="4.5" cy="4.5" fill="var(--fill-0, #95EE74)" id="Ellipse 3" r="4.5" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[15px] leading-[1.5] left-[calc(50%+23.5px)] not-italic text-[13px] text-black text-center top-[397px] tracking-[0.52px] translate-x-[-50%] w-[148px]">I’m a Business Owner</p>
      <div className="absolute left-[33px] size-[45px] top-[409px]">
        <img alt="" className="block max-w-none size-full" height="45" src={imgEllipse5} width="45" />
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[10px] leading-[1.5] left-[213px] not-italic opacity-[0.54] text-[12px] text-black text-center top-[418px] tracking-[0.48px] translate-x-[-50%] w-[252px]">I want to source products with business loans and access business loans</p>
      <p className="absolute font-['Inter:Italic',sans-serif] font-normal h-[13px] italic leading-[1.5] left-[127.5px] opacity-[0.63] text-[10px] text-black text-center top-[466px] tracking-[0.4px] translate-x-[-50%] w-[145px]">Find Suppliers</p>
      <p className="absolute font-['Inter:Italic',sans-serif] font-normal h-[46px] italic leading-[1.5] left-[274.5px] opacity-[0.63] text-[10px] text-black text-center top-[466px] tracking-[0.4px] translate-x-[-50%] w-[129px]">Get More Loans</p>
      <div className="absolute left-[74px] size-[9px] top-[469px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
          <circle cx="4.5" cy="4.5" fill="var(--fill-0, #95EE74)" id="Ellipse 3" r="4.5" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[21px] leading-[1.5] left-[176px] not-italic opacity-[0.44] text-[16px] text-black text-center top-[229px] translate-x-[-50%] w-[346px]">This helps us customize your experience</p>
      <div className="absolute flex h-[0.056px] items-center justify-center left-[21px] top-[calc(50%-255.97px)] translate-y-[-50%] w-[18px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[0.056px] relative w-[18px]">
            <div className="absolute bottom-[-13131.1%] left-0 right-[-5.56%] top-[-13231.1%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 15">
                <path d={svgPaths.p2c561580} fill="var(--stroke-0, black)" id="Arrow 1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#ececec] h-[43px] left-[14px] rounded-[10px] top-[512px] w-[337px]" data-name="Rounded rectangle" />
      <div className="absolute bg-[#376df7] h-[43px] left-[19px] rounded-[10px] top-[735px] w-[337px]" data-name="Rounded rectangle" />
      <div className="absolute flex flex-col font-['Inter:Extra_Light',sans-serif] font-extralight h-[28px] justify-center leading-[0] left-[182.5px] not-italic text-[13px] text-black text-center top-[535px] tracking-[-0.13px] translate-x-[-50%] translate-y-[-50%] w-[337px]">
        <p className="leading-[1.5]">
          <span className="font-['Inter:Bold',sans-serif] font-bold not-italic">✨</span>
          <span>{` Complete verification to unlock exclusive benefits`}</span>
        </p>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[1.5] left-[187.5px] not-italic text-[15px] text-center text-white top-[745px] tracking-[0.6px] translate-x-[-50%] w-[251px]">Continue</p>
    </div>
  );
}