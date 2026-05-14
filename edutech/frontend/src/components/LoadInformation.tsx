
export interface LoadInformationProps {
    data: string;
}   

export const LoadInformation = ({ data }: LoadInformationProps) => {
    return(
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500 font-medium animate-pulse">
                {data}
            </p>
        </div>
    );
}