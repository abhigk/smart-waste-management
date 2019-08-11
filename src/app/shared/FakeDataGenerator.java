import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Scanner;
import java.util.TimeZone;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.Random;
import java.util.HashMap;
import java.util.Locale;
import java.time.*;
import java.util.UUID;
import java.util.Date;

// empty bins every sunday
public class FakeDataGenerator {
    public static void main(String[] args) {

        Map<String, Integer> bins = new HashMap<>();

        bins.put("a1", 120);
        bins.put("a2", 120);
        bins.put("a3", 120);
        bins.put("a4", 120);
        bins.put("a5", 120);
        bins.put("a6", 120);
        bins.put("a7", 120);
        bins.put("a8", 120);
        bins.put("a9", 120);
        bins.put("a10", 120);
        bins.put("a11", 120);
        bins.put("a12", 120);
        bins.put("a13", 120);
        bins.put("a14", 120);
        bins.put("a15", 120);
        bins.put("a16", 120);
        bins.put("a17", 120);
        bins.put("a18", 120);
        bins.put("a19", 120);
        bins.put("a20", 120);
        bins.put("a21", 120);
        bins.put("a22", 120);
        bins.put("a23", 120);
        bins.put("a24", 120);
        bins.put("a25", 120);
        bins.put("a26", 120);
        bins.put("a27", 120);
        bins.put("a28", 120);

        LocalDateTime currentDate = LocalDateTime.now();
        Writer wr = null;
        int binMax = 120;
        int binLeft = 120;

        try {
            wr = new FileWriter("binReadings.json");
            // start json
            wr.write("{\n");

            LocalDateTime date = LocalDate.of(2018, 11, 02).atTime(00, 00);
            Random random = new Random();
            while (date.plusHours(2).compareTo(currentDate) < 0) {

                // generate unique key

                for (Map.Entry<String, Integer> entry : bins.entrySet()) {
                    // if sunday and between 5 am to 8 am empty the bin
                    // System.out.println(DayOfWeek.values()[random.nextInt(6)]);
                    if (date.getDayOfWeek().equals(DayOfWeek.values()[random.nextInt(6)])
                            && (date.getHour() >= 5 && date.getHour() <= 7)) {
                        entry.setValue(120);
                    }

                    int randomNumber = random.nextInt(3 + 1 - 0) + 0;

                    String uniqueID = UUID.randomUUID().toString();
                    String binID = entry.getKey();
                    binLeft = entry.getValue();
                    binLeft = binLeft - randomNumber;
                    if (binLeft <= 0) {
                        binLeft = 0;
                    }
                    Date out = Date.from(date.atZone(ZoneId.systemDefault()).toInstant());
                    SimpleDateFormat sdf = new SimpleDateFormat("dd MMMMM yyyy HH:mm:ss z");
                    sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                    wr.write(String.format(
                            "\n \"%s\" : {\n \"metadata\": {\n \"time\": \"%s\" \n},\n \"payload_fields\": {\n \"hardware_id\":\"%s\",\n \"level\":\"%s\"\n}\n},",
                            uniqueID, sdf.format(out), binID, binLeft));

                    entry.setValue(binLeft);
                }
                date = date.plusHours(2);
            }

            wr.write("}\n");

            wr.flush();
            wr.close();

        } catch (Exception e) {
            System.out.println(e);
        }
    }
}