import { SideDrawer } from "@/components/ui/SideDrawer";
import { Formatters } from "@/lib/formatters";
import { APP_STRINGS } from "@/lib/constants";
import { Promo } from "@/types/api";

export function PromoDetailView({
  isOpen,
  onClose,
  promo,
}: {
  isOpen: boolean;
  onClose: () => void;
  promo: Promo | null;
}) {
  if (!promo) return null;

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title={APP_STRINGS.details.promoTitle}>
      <div className="space-y-4">
        <div
          className="w-full h-32 rounded-xl border border-glass-border shadow-inner p-4 flex flex-col justify-end"
          style={{
            background: `linear-gradient(135deg, ${promo.themeColor || APP_STRINGS.theme.defaultColor} 0%, ${promo.themeColor ? promo.themeColor + "99" : APP_STRINGS.theme.defaultColorLight} 100%)`,
          }}
        >
          <h3 className="text-xl font-bold text-white drop-shadow-md">{promo.title}</h3>
          <p className="text-white/90 text-sm">{promo.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-glass-border/50">
          <div className="flex flex-col"><span className="text-xs text-foreground/50">{APP_STRINGS.details.promoTitleLabel}</span><span className="text-sm font-medium">{promo.title}</span></div>
          <div className="flex flex-col"><span className="text-xs text-foreground/50">{APP_STRINGS.details.promoSubtitle}</span><span className="text-sm font-medium">{promo.subtitle}</span></div>
          <div className="flex flex-col"><span className="text-xs text-foreground/50">{APP_STRINGS.details.promoTheme}</span><div className="flex items-center gap-2 mt-1"><div className="w-4 h-4 rounded-full border border-glass-border" style={{ backgroundColor: promo.themeColor || APP_STRINGS.theme.defaultColor }} /><span className="text-sm font-medium uppercase">{promo.themeColor || APP_STRINGS.theme.defaultColor}</span></div></div>
          <div className="flex flex-col mt-2"><span className="text-xs text-foreground/50">{APP_STRINGS.details.status}</span><span className={`inline-flex self-start items-center gap-1 px-2 py-0.5 mt-1 rounded text-[10px] font-semibold uppercase ${promo.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{promo.is_active ? APP_STRINGS.details.statusActiveRun : APP_STRINGS.details.statusInactive}</span></div>
          <div className="flex flex-col mt-2"><span className="text-xs text-foreground/50">{APP_STRINGS.details.createdAt}</span><span className="text-sm font-medium">{Formatters.date(promo.created_at, "datetime")}</span></div>
        </div>
      </div>
    </SideDrawer>
  );
}
