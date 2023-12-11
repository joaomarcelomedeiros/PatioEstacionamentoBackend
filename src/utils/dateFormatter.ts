import { zonedTimeToUtc, format, utcToZonedTime } from 'date-fns-tz';
const fusoHorarioBrasileiro = 'America/Sao_Paulo';
export const retornaData = (): string => {
        const dataHoraAtualBrasileira = zonedTimeToUtc(new Date(), fusoHorarioBrasileiro);
        const dataHoraFormatada = format(dataHoraAtualBrasileira, 'yyyy-MM-dd HH:mm:ss.ssXXX');
        return dataHoraFormatada;   
}
export const converterFusoHorario = (data:string) => format(utcToZonedTime(new Date(data), fusoHorarioBrasileiro), 'yyyy-MM-dd HH:mm:ssXXX');