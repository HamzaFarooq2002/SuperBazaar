import svgPaths from "./svg-pwbb4wldqn";
import imgLogo from "figma:asset/92375b66cc5f6db228cbba4fabc2bd6032c970de.png";

function HomeIndicator() {
  return (
    <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-[375px]" data-name="Home Indicator">
      <div className="absolute bg-black bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

function Copy() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] items-center leading-[1.5] left-[59.5px] not-italic text-black text-center text-nowrap top-[252px] whitespace-pre" data-name="Copy">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[16px]">Create an account</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[14px]">Enter your email to sign up for this app</p>
    </div>
  );
}

function Field() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Field">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[40px] items-center px-[16px] py-[8px] relative w-full">
          <p className="[white-space-collapse:collapse] basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#828282] text-[14px] text-nowrap">email@domain.com</p>
        </div>
      </div>
    </div>
  );
}

function InputButton() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[24px] top-[323px] w-[327px]" data-name="Input + Button">
      <Field />
    </div>
  );
}

function Field1() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Field">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] h-[40px] items-center px-[16px] py-[8px] relative w-full">
          <p className="[white-space-collapse:collapse] basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#828282] text-[14px] text-nowrap">create a strong password</p>
        </div>
      </div>
    </div>
  );
}

function InputButton1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[56px] items-start left-[24px] top-[387px] w-[327px]" data-name="Input + Button">
      <Field1 />
    </div>
  );
}

function Divider() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center justify-center left-[24px] top-[534px] w-[327px]" data-name="Divider">
      <div className="basis-0 bg-[#e6e6e6] grow h-px min-h-px min-w-px shrink-0" data-name="Divider" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#828282] text-[14px] text-center text-nowrap whitespace-pre">or</p>
      <div className="basis-0 bg-[#e6e6e6] grow h-px min-h-px min-w-px shrink-0" data-name="Divider" />
    </div>
  );
}

function Logo() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_26_144)" id="Logo">
          <path d={svgPaths.p33b7ccc0} fill="var(--fill-0, #4285F4)" id="Vector" />
          <path d={svgPaths.p15123a40} fill="var(--fill-0, #34A853)" id="Vector_2" />
          <path d={svgPaths.p28bf8e80} fill="var(--fill-0, #FBBC05)" id="Vector_3" />
          <path d={svgPaths.p1e563600} fill="var(--fill-0, #EB4335)" id="Vector_4" />
        </g>
        <defs>
          <clipPath id="clip0_26_144">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Label() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[calc(50%+0.5px)] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Label">
      <Logo />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Continue with Google</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#eeeeee] h-[40px] left-[24px] rounded-[8px] top-[578px] w-[327px]" data-name="Button">
      <Label />
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[calc(50%+0.5px)] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Label">
      <div className="relative shrink-0 size-[20px]" data-name="Logo">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-[-28.84%] max-w-none size-[158.73%] top-[-29.1%]" src={imgLogo} />
        </div>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Continue with Apple</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#eeeeee] h-[40px] left-[24px] rounded-[8px] top-[626px] w-[327px]" data-name="Button">
      <Label1 />
    </div>
  );
}

function Buttons() {
  return (
    <div className="absolute contents left-[24px] top-[578px]" data-name="Buttons">
      <Button />
      <Button1 />
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
        <p className="leading-[1.5]">Step 1 of 7</p>
      </div>
      <div className="absolute left-[83px] size-[5px] top-[27px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <circle cx="2.5" cy="2.5" fill="var(--fill-0, #C0C0C0)" id="Ellipse 7" r="2.5" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[8px] justify-center leading-[0] left-[119.5px] not-italic opacity-[0.85] text-[12px] text-black text-center top-[29px] tracking-[-0.12px] translate-x-[-50%] translate-y-[-50%] w-[129px]">
        <p className="leading-[1.5]">Account</p>
      </div>
    </div>
  );
}

export default function Onboard() {
  return (
    <div className="bg-white relative size-full" data-name="Onboard 1/7">
      <HomeIndicator />
      <Copy />
      <InputButton />
      <InputButton1 />
      <div className="absolute bg-[#376df7] h-[43px] left-[19px] rounded-[10px] top-[467px] w-[337px]" data-name="Rounded rectangle" />
      <Divider />
      <Buttons />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[1.5] left-[187.5px] not-italic text-[#828282] text-[0px] text-[12px] text-center top-[690px] translate-x-[-50%] w-[337px]">
        <span>{`By clicking continue, you agree to our `}</span>
        <span className="text-black">Terms of Service</span>
        <span>{` and `}</span>
        <span className="text-black">Privacy Policy</span>
      </p>
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[187px] not-italic opacity-[0.54] text-[11px] text-black text-center text-nowrap top-[166.5px] tracking-[-0.11px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.5] whitespace-pre">Create your account or sign in to continue</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[calc(50%-0.5px)] not-italic text-[24px] text-black text-center text-nowrap top-[136px] tracking-[-0.24px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.5] whitespace-pre">Welcome to SuperBazaar</p>
      </div>
      <StatusBar />
      <StatusBar1 />
      <div className="absolute bg-[#d9d9d9] h-[29px] left-[18px] opacity-[0.57] rounded-[99px] top-[209px] w-[338px]" />
      <div className="absolute bg-white h-[21px] left-[21px] rounded-[99px] top-[213px] w-[169px]" />
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[15px] justify-center leading-[0] left-[98.5px] not-italic text-[11px] text-black text-center top-[222.5px] translate-x-[-50%] translate-y-[-50%] w-[85px]">
        <p className="leading-[1.5]">Sign Up</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[15px] justify-center leading-[0] left-[268.5px] not-italic text-[11px] text-black text-center top-[222.5px] translate-x-[-50%] translate-y-[-50%] w-[85px]">
        <p className="leading-[1.5]">Login</p>
      </div>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[21px] leading-[1.5] left-[187.5px] not-italic text-[15px] text-center text-white top-[478px] tracking-[0.6px] translate-x-[-50%] w-[251px]">Continue</p>
    </div>
  );
}