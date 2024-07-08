
type Destructor = () => void;

export const combineDestructors = (...destructors: Destructor[]) => {
    return () => {
        for (const destructor of destructors) {
            destructor();
        }
    }
}