import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

spacing = {
    "xxl": "48px",
    "base": "8px",
    "margin-desktop": "40px",
    "xxxl": "64px",
    "margin-mobile": "16px",
    "gutter": "24px",
    "md": "16px",
    "xs": "4px",
    "sm": "8px",
    "xl": "32px",
    "lg": "24px"
}

fonts = {
    "headline-lg-mobile": "text-[24px] leading-[32px] font-[600]",
    "headline-lg": "text-[30px] leading-[38px] tracking-[-0.01em] font-[600]",
    "body-md": "text-[16px] leading-[24px] font-[400]",
    "body-lg": "text-[18px] leading-[28px] font-[400]",
    "title-lg": "text-[20px] leading-[28px] font-[600]",
    "label-sm": "text-[12px] leading-[16px] tracking-[0.02em] font-[600]",
    "display-md": "text-[36px] leading-[44px] tracking-[-0.02em] font-[700]",
    "display-lg": "text-[48px] leading-[56px] tracking-[-0.02em] font-[700]",
    "label-md": "text-[14px] leading-[20px] tracking-[0.01em] font-[500]"
}

# Replace font sizes and font families first to avoid overlap
for font_name, arbitrary in fonts.items():
    # Remove the font-<name> classes since we map it to standard
    content = re.sub(rf'\bfont-{font_name}\b', '', content)
    # Replace text-<name> with arbitrary
    content = re.sub(rf'\btext-{font_name}\b', arbitrary, content)

# Replace spacing
for name, val in spacing.items():
    prefixes = ['p', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'gap', 'top', 'bottom', 'left', 'right', 'w', 'h']
    for p in prefixes:
        # e.g. gap-lg -> gap-[24px]
        content = re.sub(rf'\b{p}-{name}\b', f'{p}-[{val}]', content)

# Clean up extra spaces
content = re.sub(r' +', ' ', content)
content = re.sub(r' className=" ', ' className="', content)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
print("Classes fixed!")
