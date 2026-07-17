import Image from "next/image";

export default function ProfileSummary() {
  return (
    <div className="lg:col-span-5 bg-surface-container-lowest border border-surface-variant rounded-xl p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
      {/* Subtle decorative background element */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-primary-fixed rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
      <div className="relative w-32 h-32 rounded-full bg-surface-container-high overflow-hidden mb-6 border-4 border-surface shadow-md">
        <Image
          alt="Alex profile picture"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIlOMm8Ev6ufs0ENEvncffYe1mOZAtgEpmNq7v49onea9t3Xpt9gdNqXeiJjUO8T61H8nwfbbnTWfgYPaVrbJnOaK581tGJVMXDlcdHOqw_W8EQy31dHRzhFxBcAmFDuIqoCsXHPuWyd14iRvE_tVmipYXeR6_XhWEbmX1E7sBkn3vT1lZbf8R8q3Wv9CfFdHbl5uYNaZTkUaCXG4LN8fr39_MJA_P3CgsbVz2aWFMlb3xvB4v1oxIVpReb4cB71JaJ1XVdQu-KQ"
          width={128}
          height={128}
          unoptimized
        />
      </div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Alex</h2>
      <p className="font-body-md text-body-md text-secondary mb-4">@alex_j</p>
      <div className="mt-auto w-full pt-6 border-t border-surface-variant flex flex-col items-center">
        <span className="font-label-caps text-label-caps text-tertiary mb-1 uppercase tracking-wider">
          Date of Birth
        </span>
        <span className="font-title-sm text-title-sm text-on-surface">Jan 12, 1995</span>
      </div>
    </div>
  );
}
