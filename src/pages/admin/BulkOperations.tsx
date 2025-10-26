import { BulkPaymentOperations } from "@/components/admin/BulkPaymentOperations";

const BulkOperations = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk Payment Operations</h1>
        <p className="text-muted-foreground">
          Efficiently process multiple Bitcoin payments, escrow releases, and refunds in batch mode
        </p>
      </div>
      
      <BulkPaymentOperations />
    </div>
  );
};

export default BulkOperations;
