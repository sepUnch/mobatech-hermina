import { PolyclinicsFormModal } from "./PolyclinicsFormModal";
import { DeleteModal } from "@/components/DeleteModal";
import { Polyclinic } from "@/types/api";

export function PolyclinicsModals({
  showModal, setShowModal, selectedItem, name, setName,
  description, setDescription, imageUrl, setImageUrl,
  isActive, setIsActive, handleSave, saving, deleteId,
  setDeleteId, handleDelete
}: {
  showModal: boolean; setShowModal: (v: boolean) => void; selectedItem: Polyclinic | null;
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  imageUrl: string; setImageUrl: (v: string) => void;
  isActive: boolean; setIsActive: (v: boolean) => void;
  handleSave: (e: React.FormEvent) => void; saving: boolean;
  deleteId: number | null; setDeleteId: (id: number | null) => void;
  handleDelete: (id: number) => void;
}) {
  return (
    <>
      <PolyclinicsFormModal
        showModal={showModal} setShowModal={setShowModal}
        selectedItem={selectedItem} name={name} setName={setName}
        description={description} setDescription={setDescription}
        imageUrl={imageUrl} setImageUrl={setImageUrl}
        isActive={isActive} setIsActive={setIsActive}
        handleSave={handleSave} saving={saving}
      />
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
        isLoading={saving}
      />
    </>
  );
}
