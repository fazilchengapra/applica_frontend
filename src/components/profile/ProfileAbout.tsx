export default function ProfileAbout() {
  return (
    <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 shadow-sm w-full">
      <div className="flex justify-between items-center mb-6 border-b border-surface-variant pb-4">
        <h3 className="font-headline-md text-headline-md text-on-surface">About</h3>
        <button className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-bright cursor-pointer">
          <span className="material-symbols-outlined" data-icon="edit">
            edit
          </span>
        </button>
      </div>
      <div className="prose prose-sm max-w-none text-on-surface-variant font-body-md text-body-md leading-relaxed">
        <p className="mb-4">
          I am an Automation Architect focused on streamlining complex workflows
          and reducing manual operational overhead. With over 6 years of
          experience in robotic process automation (RPA) and low-code platforms,
          I specialize in designing scalable solutions that integrate seamlessly
          with existing enterprise software ecosystems.
        </p>
        <p>
          My current career goals revolve around mastering AI-driven automation
          and developing intelligent decision-making agents. I am passionate
          about creating clean, maintainable automation scripts and documenting
          architectures that empower cross-functional teams to work more
          efficiently. When I'm not configuring workflows, I enjoy exploring new
          data visualization tools and contributing to open-source automation
          libraries.
        </p>
      </div>
    </div>
  );
}
